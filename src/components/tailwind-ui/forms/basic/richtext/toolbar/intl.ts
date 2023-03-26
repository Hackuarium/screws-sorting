const defaultIntl: RichTextIntl = {
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
  paragraph: 'Normal',
  ol: 'Numbered List',
  ul: 'Bullet List',
  bold: 'Bold',
  italic: 'Italic',
  underline: 'Underline',
  subscript: 'Subscript',
  superscript: 'Superscript',
  textColor: 'Text Color',
  image: {
    tooltip: 'Image',
    form: {
      header: 'Add an image',
      alt: 'Image description',
      src: 'Image URL',
      submit: 'Add image',
    },
  },
  table: {
    form: {
      columns: 'Columns',
      header: 'Create a new table',
      rows: 'Rows',
      submit: 'Create table',
      includeColumnAsHeaders: 'With column as headers',
      includeRowAsHeaders: 'With row as headers',
    },
    menu: {
      insertRowAbv: 'Insert row above',
      insertRowBlv: 'Insert row below',
      insertColLeft: 'Insert column left',
      insertColRight: 'Insert column right',
      deleteCol: 'Delete column',
      deleteRow: 'Delete row',
    },
    tooltip: 'Table',
  },
  right: 'Align to right',
  left: 'Align to left',
  justify: 'Justify text',
  center: 'Align to center',
};

export interface RichTextImageIntl {
  tooltip: string;
  form: {
    header: string;
    alt: string;
    src: string;
    submit: string;
  };
}

export interface RichTextTableIntl {
  form: {
    columns: string;
    header: string;
    rows: string;
    submit: string;
    includeColumnAsHeaders: string;
    includeRowAsHeaders: string;
  };
  menu: {
    insertRowAbv: string;
    insertRowBlv: string;
    insertColLeft: string;
    insertColRight: string;
    deleteCol: string;
    deleteRow: string;
  };
  tooltip: string;
}

export interface RichTextIntl {
  h1: string;
  h2: string;
  h3: string;
  paragraph: string;
  ol: string;
  ul: string;
  bold: string;
  italic: string;
  underline: string;
  subscript: string;
  superscript: string;
  textColor: string;
  right: string;
  left: string;
  justify: string;
  center: string;
  image: RichTextImageIntl;
  table: RichTextTableIntl;
}

export default defaultIntl;
