import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { INSERT_TABLE_COMMAND } from '@lexical/table';

import { useOnOff } from '../../../../../hooks/useOnOff';
import { FormRHFModal } from '../../../../../overlays/FormRHFModal';
import { CheckboxFieldRHF } from '../../../../react-hook-form/CheckboxFieldRHF';
import { InputFieldRHF } from '../../../../react-hook-form/InputFieldRHF';
import { SubmitButtonRHF } from '../../../../react-hook-form/SubmitButtonRHF';
import { useRichTextContext } from '../../context/RichTextContext';
import { RichTextFormatType } from '../../context/RichTextProvider';
import { ToolbarPluginButton } from '../ToolbarPlugin';
import { useToolbarPluginContext } from '../toolbarContext';
import { TooltipPluginElement } from '../types';

export interface TableIntl {
  tooltip: string;
  form: {
    header: string;
    rows: string;
    columns: string;
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
}

export default function TablePlugin(): TooltipPluginElement {
  const toolbarState = useToolbarPluginContext();
  const [state] = useRichTextContext();
  const [isOpenModal, openModal, closeModal] = useOnOff(false);

  const intl = toolbarState.intl.table;

  return (
    <>
      <ToolbarPluginButton
        onClick={openModal}
        tooltip={intl.tooltip}
        variant={!state['table' as RichTextFormatType] ? 'white' : 'secondary'}
      >
        <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20">
          <path d="M3 17V3h14v14Zm1.5-9.562h11V4.5h-11Zm4.167 4.041h2.666V8.938H8.667Zm0 4.021h2.666v-2.521H8.667ZM4.5 11.479h2.667V8.938H4.5Zm8.333 0H15.5V8.938h-2.667ZM4.5 15.5h2.667v-2.521H4.5Zm8.333 0H15.5v-2.521h-2.667Z" />
        </svg>
      </ToolbarPluginButton>
      <TableForm isOpen={isOpenModal} closeModal={closeModal} />
    </>
  );
}

interface TableFormProps {
  isOpen: boolean;
  closeModal: () => void;
}

const defaultTableFormValues = {
  columns: 5,
  rows: 5,
  includeColumnAsHeaders: false,
  includeRowAsHeaders: true,
};

function TableForm(props: TableFormProps) {
  const { closeModal, isOpen } = props;

  const toolbarState = useToolbarPluginContext();
  const [editor] = useLexicalComposerContext();

  const intl = toolbarState.intl.table;

  function onSubmit(values: typeof defaultTableFormValues) {
    editor.dispatchCommand(INSERT_TABLE_COMMAND, {
      columns: String(values.columns),
      rows: String(values.rows),
      includeHeaders: {
        columns: values.includeColumnAsHeaders,
        rows: values.includeRowAsHeaders,
      },
    });

    closeModal();
  }

  return (
    <FormRHFModal
      isOpen={isOpen}
      onSubmit={onSubmit}
      defaultValues={defaultTableFormValues}
      onRequestClose={closeModal}
    >
      <FormRHFModal.Header>{intl.form.header}</FormRHFModal.Header>
      <FormRHFModal.Body>
        <InputFieldRHF name="columns" type="number" label={intl.form.columns} />
        <InputFieldRHF name="rows" type="number" label={intl.form.rows} />
        <CheckboxFieldRHF
          name="includeRowAsHeaders"
          label={intl.form.includeRowAsHeaders}
        />
        <CheckboxFieldRHF
          name="includeColumnAsHeaders"
          label={intl.form.includeColumnAsHeaders}
        />
      </FormRHFModal.Body>
      <FormRHFModal.Footer>
        <SubmitButtonRHF>{intl.form.submit}</SubmitButtonRHF>
      </FormRHFModal.Footer>
    </FormRHFModal>
  );
}
