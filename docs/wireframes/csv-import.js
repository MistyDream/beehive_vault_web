// This prototype uses a fixed synthetic response; it never calls an API or parses arbitrary CSV.
const sampleCsv =
  'Booking;Description;Amount\n10/08/2026;Groceries;-12,3456\n11/08/2026;Salary;2400,00\n12/08/2026;Refund;18,50\n31/02/2026;Invalid booking;-9,00\n13/08/2026;Zero amount;0';
const sourceRows = [
  {
    line: 2,
    label: 'Groceries',
    date: '10 août 2026',
    signedAmount: '−12,3456',
    valid: true,
  },
  {
    line: 3,
    label: 'Salary',
    date: '11 août 2026',
    signedAmount: '+2 400,00',
    valid: true,
  },
  {
    line: 4,
    label: 'Refund',
    date: '12 août 2026',
    signedAmount: '+18,50',
    valid: true,
  },
  {
    line: 5,
    valid: false,
    error: 'Date invalide : utilisez une date réelle au format JJ/MM/AAAA.',
  },
  {
    line: 6,
    valid: false,
    error:
      'Montant invalide : le montant doit être non nul, avec au maximum 16 chiffres entiers et 4 décimales.',
  },
];
const byId = (id) => document.getElementById(id);
const state = {
  step: 1,
  fileName: '',
  rows: [],
  imported: new Set(),
  scenario: 'normal',
  busy: false,
  retry: false,
  format: '',
};
const natureName = (nature) => (nature === 'income' ? 'Revenu' : 'Dépense');
const effectName = (nature, effect) =>
  effect === 'standard'
    ? nature === 'income'
      ? 'Revenu reçu'
      : 'Dépense engagée'
    : nature === 'income'
      ? 'Reprise d’un revenu'
      : 'Remboursement d’une dépense';
const countPhrase = (count, singular, plural) =>
  `${count} ${count === 1 ? singular : plural}`;
const selectedRows = () =>
  state.rows.filter((row) => row.valid && row.selected);
function announce(message) {
  byId('announcement').textContent = message;
}
function clearError() {
  byId('error').hidden = true;
  document.querySelectorAll('[aria-invalid]').forEach((element) => {
    element.removeAttribute('aria-invalid');
    element.removeAttribute('aria-describedby');
  });
  byId('file').setAttribute('aria-describedby', 'file-help file-status');
}
function showError(title, message, field, retry) {
  const container = byId('error');
  container.replaceChildren();
  const heading = document.createElement('strong');
  heading.textContent = title;
  const detail = document.createElement('p');
  detail.textContent = message;
  container.append(heading, detail);
  if (field) {
    const link = document.createElement('a');
    link.href = `#${field}`;
    link.textContent = 'Revenir au champ à corriger';
    link.onclick = (event) => {
      event.preventDefault();
      const target = byId(field);
      const section = target.closest('section');
      goTo(Number(section.id.slice(5)));
      target.focus();
    };
    container.append(link);
    byId(field).setAttribute('aria-invalid', 'true');
    byId(field).setAttribute('aria-describedby', 'error');
  }
  if (retry) {
    const button = document.createElement('button');
    button.textContent = 'Réessayer';
    button.onclick = retry;
    container.append(button);
  }
  container.hidden = false;
  container.focus();
}
function goTo(step) {
  clearError();
  state.step = step;
  for (let index = 1; index <= 5; index++)
    byId(`step-${index}`).hidden = index !== step;
  document.querySelectorAll('[data-step]').forEach((item) => {
    if (Number(item.dataset.step) === Math.min(step, 4))
      item.setAttribute('aria-current', 'step');
    else item.removeAttribute('aria-current');
  });
  document.querySelectorAll('.context').forEach((item) => {
    item.textContent = `${byId('account').selectedOptions[0].textContent} · ${state.fileName}`;
  });
  byId(`step-${step}`).querySelector('h2').focus();
}
function newRows() {
  state.rows = (state.scenario === 'empty' ? [] : sourceRows).map((row) => ({
    ...row,
    valid: state.scenario === 'rejected' ? false : row.valid,
    error: row.error || 'Montant invalide pour le format choisi.',
    selected: false,
    nature: '',
    effect: '',
  }));
}
function updateSelection() {
  const selected = selectedRows();
  const missing = selected.filter((row) => !row.nature || !row.effect).length;
  byId('selection-status').textContent =
    `${countPhrase(selected.length, 'ligne sélectionnée', 'lignes sélectionnées')}${missing ? ` · ${missing} à classer` : ''}.`;
}
function makeOption(value, text, selected) {
  const option = document.createElement('option');
  option.value = value;
  option.textContent = text;
  option.selected = selected;
  return option;
}
function classificationSelect(row, field) {
  const wrapper = document.createElement('div');
  const label = document.createElement('label');
  const id = `row-${row.line}-${field}`;
  label.htmlFor = id;
  label.textContent = field === 'nature' ? 'Nature' : 'Effet';
  const select = document.createElement('select');
  select.id = id;
  select.setAttribute(
    'aria-label',
    `${label.textContent}, ligne ${row.line}, ${row.label}`,
  );
  const options =
    field === 'nature'
      ? [
          ['', 'Choisir une nature'],
          ['expense', 'Dépense'],
          ['income', 'Revenu'],
        ]
      : [
          ['', 'Choisir un effet'],
          ['standard', 'Habituel'],
          ['reversal', 'Inverse'],
        ];
  options.forEach(([value, text]) =>
    select.append(makeOption(value, text, row[field] === value)),
  );
  select.onchange = () => {
    row[field] = select.value;
    byId(`row-${row.line}-meaning`).textContent =
      row.nature && row.effect
        ? effectName(row.nature, row.effect)
        : 'Choisissez une nature et un effet.';
    updateSelection();
  };
  select.setAttribute('aria-describedby', `row-${row.line}-meaning`);
  wrapper.append(label, select);
  if (field === 'effect') {
    const meaning = document.createElement('p');
    meaning.id = `row-${row.line}-meaning`;
    meaning.className = 'help';
    meaning.textContent =
      row.nature && row.effect
        ? effectName(row.nature, row.effect)
        : 'Choisissez une nature et un effet.';
    wrapper.append(meaning);
  }
  return wrapper;
}
function renderRows() {
  const container = byId('rows');
  container.replaceChildren();
  const filter = byId('row-filter').value;
  const rows = state.rows.filter(
    (row) =>
      filter === 'all' ||
      (filter === 'valid' && row.valid) ||
      (filter === 'rejected' && !row.valid) ||
      (filter === 'selected' && row.selected),
  );
  byId('preview-count').textContent =
    `${state.rows.filter((row) => row.valid).length} lignes valides · ${state.rows.filter((row) => !row.valid).length} lignes rejetées · aucun ajout à ce stade.`;
  if (!rows.length) {
    const empty = document.createElement('p');
    empty.textContent = state.rows.length
      ? 'Aucune ligne dans cette vue. Changez le filtre pour retrouver les autres lignes.'
      : 'Le fichier ne contient aucune ligne de données. Choisissez un autre relevé.';
    container.append(empty);
  }
  rows.forEach((row) => {
    const article = document.createElement('article');
    article.className = 'row';
    const choice = document.createElement('label');
    choice.className = 'row-select';
    if (row.valid) {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = row.selected;
      checkbox.setAttribute(
        'aria-label',
        `Sélectionner la ligne ${row.line}, ${row.label}`,
      );
      checkbox.onchange = () => {
        row.selected = checkbox.checked;
        updateSelection();
      };
      choice.append(checkbox);
    } else choice.textContent = '—';
    const content = document.createElement('div');
    const heading = document.createElement('h3');
    heading.textContent = row.valid ? row.label : `Ligne ${row.line} rejetée`;
    const meta = document.createElement('p');
    meta.className = 'meta';
    meta.textContent = row.valid
      ? `Ligne ${row.line} · ${row.date} · Valide`
      : 'Non sélectionnable · aucune transaction ne sera créée';
    content.append(heading, meta);
    article.append(choice, content);
    if (row.valid) {
      const amount = document.createElement('div');
      amount.className = 'row-amount';
      amount.textContent = `${row.signedAmount} EUR`;
      const caption = document.createElement('small');
      caption.textContent = 'Montant du fichier';
      amount.append(document.createElement('br'), caption);
      const classification = document.createElement('div');
      classification.className = 'row-classification';
      classification.append(
        classificationSelect(row, 'nature'),
        classificationSelect(row, 'effect'),
      );
      article.append(amount, classification);
    } else {
      const error = document.createElement('p');
      error.className = 'row-error';
      error.textContent = row.error;
      article.append(error);
    }
    container.append(article);
  });
  updateSelection();
}
async function waitForAction(button, label) {
  state.busy = true;
  const oldLabel = button.textContent;
  document
    .querySelectorAll(
      `#step-${state.step} button, #step-${state.step} input, #step-${state.step} select, .lab button, .lab select`,
    )
    .forEach((control) => {
      control.disabled = true;
    });
  byId(`step-${state.step}`).setAttribute('aria-busy', 'true');
  button.textContent = label;
  announce(label);
  await new Promise((resolve) => setTimeout(resolve, 650));
  document.querySelectorAll('button, input, select').forEach((control) => {
    control.disabled = false;
  });
  byId(`step-${state.step}`).removeAttribute('aria-busy');
  button.textContent = oldLabel;
  state.busy = false;
}
function formatSignature() {
  return [
    'delimiter',
    'date-format',
    'decimal',
    'booking-column',
    'label-column',
    'amount-column',
  ]
    .map((id) => byId(id).value)
    .join('|');
}
async function preview() {
  if (state.busy) return;
  clearError();
  const fields = ['booking-column', 'label-column', 'amount-column'];
  if (new Set(fields.map((id) => byId(id).value)).size !== 3) {
    showError(
      'Associez trois colonnes distinctes',
      'Une même colonne ne peut pas servir pour plusieurs champs.',
      'booking-column',
    );
    return;
  }
  await waitForAction(byId('preview'), 'Analyse du fichier…');
  if (state.scenario === 'network' && !state.retry) {
    state.retry = true;
    showError(
      'Impossible d’afficher l’aperçu',
      'Le service ne répond pas. Votre fichier et votre configuration sont conservés.',
      null,
      preview,
    );
    return;
  }
  if (state.scenario === 'limit') {
    showError(
      'Le relevé dépasse une limite de taille',
      'Utilisez un fichier de 1 Mio maximum. Si le fichier respecte cette limite, réduisez-le : son envoi peut être trop volumineux après préparation.',
      'file',
    );
    return;
  }
  if (state.scenario === 'row-limit') {
    showError(
      'Le relevé contient trop de lignes',
      'Limitez le fichier à 5 000 enregistrements de données, puis choisissez-le à nouveau. Aucun aperçu partiel n’est disponible.',
    );
    return;
  }
  if (state.scenario === 'syntax') {
    showError(
      'Le fichier ne peut pas être lu',
      'Vérifiez la structure du CSV, notamment les guillemets. Aucun aperçu partiel n’est disponible.',
    );
    return;
  }
  if (byId('delimiter').value !== 'semicolon') {
    showError(
      'Les colonnes attendues sont absentes',
      'Le fichier fictif utilise des points-virgules. Vérifiez le séparateur et les noms de colonnes.',
      'delimiter',
    );
    return;
  }
  if (
    byId('booking-column').value !== 'Booking' ||
    byId('label-column').value !== 'Description' ||
    byId('amount-column').value !== 'Amount'
  ) {
    showError(
      'La démonstration utilise une association fixe',
      'Associez Booking à la date, Description au libellé et Amount au montant pour poursuivre.',
      'booking-column',
    );
    return;
  }
  const signature = formatSignature();
  if (!state.rows.length || state.format !== signature) {
    newRows();
    state.format = signature;
  }
  if (
    byId('date-format').value !== 'day_month_year' ||
    byId('decimal').value !== 'comma'
  )
    state.rows.forEach((row) => {
      row.valid = false;
      row.selected = false;
      row.error =
        'Date ou montant incompatible avec le format choisi. Vérifiez la configuration.';
    });
  renderRows();
  goTo(3);
  announce('Aperçu disponible. Aucune ligne sélectionnée automatiquement.');
}
function renderReview(container, results) {
  container.replaceChildren();
  selectedRows().forEach((row) => {
    const item = document.createElement('div');
    item.className = 'review-row';
    const content = document.createElement('div');
    const title = document.createElement('strong');
    title.textContent = `Ligne ${row.line} · ${row.label}`;
    const detail = document.createElement('p');
    detail.textContent = `${natureName(row.nature)} · ${effectName(row.nature, row.effect)} · ${row.date}`;
    content.append(title, detail);
    const amount = document.createElement('div');
    amount.textContent = `${row.signedAmount} EUR · montant du fichier`;
    if (results) {
      const status = document.createElement('p');
      status.className = 'status';
      status.textContent =
        row.result === 'duplicate'
          ? 'Déjà importée · aucun nouvel ajout'
          : 'Importée';
      content.append(status);
    }
    item.append(content, amount);
    container.append(item);
  });
}
function toConfirmation() {
  clearError();
  if (!selectedRows().length) {
    showError(
      'Sélectionnez au moins une ligne',
      'Choisissez une ligne valide pour poursuivre. Les lignes rejetées ne peuvent pas être importées.',
    );
    return;
  }
  const missing = selectedRows().find((row) => !row.nature || !row.effect);
  if (missing) {
    byId('row-filter').value = 'all';
    renderRows();
    showError(
      'Précisez la nature et l’effet',
      `La ligne ${missing.line} est encore à classer. Utilisez l’affectation groupée ou les choix de la ligne.`,
      `row-${missing.line}-${!missing.nature ? 'nature' : 'effect'}`,
    );
    return;
  }
  byId('confirm-count').textContent =
    `${countPhrase(selectedRows().length, 'ligne sélectionnée', 'lignes sélectionnées')} · ${countPhrase(state.rows.filter((row) => !row.valid).length, 'ligne rejetée laissée de côté', 'lignes rejetées laissées de côté')}.`;
  renderReview(byId('confirmation-rows'), false);
  goTo(4);
}
async function confirmImport() {
  if (state.busy) return;
  clearError();
  await waitForAction(byId('confirm'), 'Import en cours…');
  if (state.scenario === 'archived') {
    showError(
      'Ce compte n’est plus disponible',
      'Le compte peut avoir été archivé ou retiré du foyer. Revenez au choix du compte ; vos paramètres restent disponibles.',
      null,
      () => goTo(1),
    );
    return;
  }
  if (state.scenario === 'selection') {
    showError(
      'La sélection doit être vérifiée',
      'Aucune ligne n’a été ajoutée. La ligne 2 n’est plus acceptée. Revenez à l’aperçu pour la vérifier.',
      null,
      () => {
        byId('row-filter').value = 'all';
        renderRows();
        goTo(3);
        showError(
          'Vérifiez la ligne 2',
          'Cette ligne a été refusée pendant la confirmation. Relancez l’aperçu ou retirez-la de la sélection.',
          'row-2-nature',
        );
      },
    );
    return;
  }
  if (state.scenario === 'confirm-network' && !state.retry) {
    selectedRows().forEach((row) => state.imported.add(row.line));
    state.retry = true;
    showError(
      'La confirmation n’a pas pu être reçue',
      'L’import a peut-être abouti. Réessayez avec ce même relevé et cette même sélection : les lignes déjà importées ne seront pas ajoutées deux fois.',
      null,
      confirmImport,
    );
    return;
  }
  selectedRows().forEach((row) => {
    row.result = state.imported.has(row.line) ? 'duplicate' : 'imported';
    state.imported.add(row.line);
  });
  const imported = selectedRows().filter(
    (row) => row.result === 'imported',
  ).length;
  const duplicate = selectedRows().length - imported;
  const summary = byId('result-summary');
  summary.replaceChildren();
  const title = document.createElement('strong');
  title.textContent = `${countPhrase(imported, 'ligne importée', 'lignes importées')} · ${countPhrase(duplicate, 'déjà importée', 'déjà importées')}`;
  summary.append(title);
  renderReview(byId('result-rows'), true);
  goTo(5);
  announce(title.textContent);
}
function chooseExample() {
  state.fileName = 'sample-statement.csv';
  state.rows = [];
  state.format = '';
  byId('file-status').textContent =
    'sample-statement.csv · exemple fictif prêt';
  clearError();
}
byId('use-example').onclick = chooseExample;
byId('download-example').href = URL.createObjectURL(
  new Blob([sampleCsv], { type: 'text/csv;charset=utf-8' }),
);
byId('file').onchange = async () => {
  const file = byId('file').files[0];
  if (!file) return;
  state.fileName = '';
  state.rows = [];
  state.format = '';
  byId('file-status').textContent = 'Aucun fichier utilisable choisi';
  clearError();
  if (file.size > 1024 * 1024) {
    showError(
      'Le fichier dépasse 1 Mio',
      'Choisissez un relevé plus petit.',
      'file',
    );
    return;
  }
  const contents = await file.text();
  if (contents !== sampleCsv) {
    showError(
      'Ce prototype utilise uniquement le CSV fictif',
      'Téléchargez l’exemple ou cliquez sur « Utiliser le relevé fictif ». Vos autres fichiers ne sont pas analysés.',
      'file',
    );
    return;
  }
  state.fileName = file.name;
  state.rows = [];
  state.format = '';
  byId('file-status').textContent = `${file.name} · exemple fictif prêt`;
};
byId('to-config').onclick = () => {
  if (!state.fileName) {
    showError(
      'Choisissez un relevé CSV',
      'Utilisez le fichier fictif pour essayer ce parcours.',
      'file',
    );
    return;
  }
  if (state.scenario === 'no-account') {
    showError(
      'Un compte actif est nécessaire',
      'Créez ou réactivez un compte avant de poursuivre.',
    );
    return;
  }
  goTo(2);
};
byId('preview').onclick = preview;
byId('select-all').onclick = () => {
  state.rows.forEach((row) => {
    row.selected = row.valid;
  });
  renderRows();
  announce('Toutes les lignes valides sont sélectionnées.');
};
byId('select-none').onclick = () => {
  state.rows.forEach((row) => {
    row.selected = false;
  });
  renderRows();
  announce('Sélection effacée.');
};
byId('row-filter').onchange = renderRows;
byId('apply-bulk').onclick = () => {
  clearError();
  if (!selectedRows().length) {
    showError(
      'Sélectionnez d’abord des lignes',
      'L’affectation groupée concerne seulement les lignes sélectionnées.',
    );
    return;
  }
  if (!byId('bulk-nature').value || !byId('bulk-effect').value) {
    showError(
      'Choisissez une nature et un effet',
      'Les deux choix sont nécessaires avant d’appliquer l’affectation.',
      !byId('bulk-nature').value ? 'bulk-nature' : 'bulk-effect',
    );
    return;
  }
  selectedRows().forEach((row) => {
    row.nature = byId('bulk-nature').value;
    row.effect = byId('bulk-effect').value;
  });
  renderRows();
  announce('Affectation appliquée. Vous pouvez corriger chaque ligne.');
};
byId('to-confirm').onclick = toConfirmation;
byId('confirm').onclick = confirmImport;
document.querySelectorAll('[data-back]').forEach((button) => {
  button.onclick = () => goTo(Number(button.dataset.back));
});
byId('reimport').onclick = toConfirmation;
byId('new-import').onclick = () => {
  state.fileName = '';
  state.rows = [];
  state.format = '';
  byId('file').value = '';
  byId('file-status').textContent = 'Aucun fichier choisi';
  goTo(1);
};
byId('account').onchange = () => {
  state.rows = [];
  state.imported.clear();
  state.format = '';
};
byId('theme').onclick = () => {
  const dark = document.documentElement.dataset.theme !== 'dark';
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  byId('theme').textContent = dark ? 'Thème clair' : 'Thème sombre';
  byId('theme').setAttribute('aria-pressed', String(dark));
};
byId('reset').onclick = () => location.reload();
byId('apply-scenario').onclick = () => {
  state.scenario = byId('scenario').value;
  state.retry = false;
  state.rows = [];
  state.format = '';
  byId('no-account').hidden = state.scenario !== 'no-account';
  byId('account').hidden = state.scenario === 'no-account';
  chooseExample();
  goTo(1);
  announce('Scénario chargé. Parcourez les étapes pour essayer cet état.');
};
goTo(1);
