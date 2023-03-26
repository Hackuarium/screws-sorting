import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

import { useOnOff } from '../../../../../hooks/useOnOff';
import { FormRHFModal } from '../../../../../overlays/FormRHFModal';
import { InputFieldRHF } from '../../../../react-hook-form/InputFieldRHF';
import { SubmitButtonRHF } from '../../../../react-hook-form/SubmitButtonRHF';
import { INSERT_IMAGE_COMMAND } from '../../plugins/ImagesPlugin';
import { ToolbarPluginButton } from '../ToolbarPlugin';
import { useToolbarPluginContext } from '../toolbarContext';
import { TooltipPluginElement } from '../types';

export interface ImageIntl {
  tooltip: string;
  form: {
    header: string;
    src: string;
    alt: string;
    submit: string;
  };
}

export default function ImagePlugin(): TooltipPluginElement {
  const [isOpenModal, openModal, closeModal] = useOnOff(false);

  const toolbarState = useToolbarPluginContext();
  const intl = toolbarState.intl.image as ImageIntl;

  return (
    <>
      <ToolbarPluginButton
        variant="white"
        onClick={openModal}
        tooltip={intl.tooltip}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="20"
          viewBox="0 96 960 960"
          width="20"
        >
          <path d="M292 768q-34.65 0-59.325-24.675Q208 718.65 208 684V260q0-34.65 24.675-59.325Q257.35 176 292 176h191l84 84h269q34.65 0 59.325 24.675Q920 309.35 920 344v340q0 34.65-24.675 59.325Q870.65 768 836 768H292Zm0-84h544V344H532l-84-84H292v424Zm507 252H124q-34.65 0-59.325-24.675Q40 886.65 40 852V345h84v507h675v84ZM366 611h397L629 435 521 576l-64-86-91 121Zm-74 73V260v424Z" />
        </svg>
      </ToolbarPluginButton>
      <ImageForm isOpen={isOpenModal} closeModal={closeModal} />
    </>
  );
}

interface ImageFormProps {
  isOpen: boolean;
  closeModal: () => void;
}

const defaultImageFormValues = {
  src: '',
  alt: '',
};

function ImageForm(props: ImageFormProps) {
  const { closeModal, isOpen } = props;

  const [editor] = useLexicalComposerContext();
  const toolbarState = useToolbarPluginContext();
  const intl = toolbarState.intl.image;

  function onSubmit(values: typeof defaultImageFormValues) {
    if (!values.src) {
      return;
    }

    editor.dispatchCommand(INSERT_IMAGE_COMMAND, values);
    closeModal();
  }

  return (
    <FormRHFModal
      isOpen={isOpen}
      onRequestClose={closeModal}
      defaultValues={defaultImageFormValues}
      fluid={false}
      onSubmit={onSubmit}
    >
      <FormRHFModal.Header>{intl.form.header}</FormRHFModal.Header>
      <FormRHFModal.Body>
        <InputFieldRHF name="src" label={intl.form.src} />
        <InputFieldRHF name="alt" label={intl.form.alt} />
      </FormRHFModal.Body>
      <FormRHFModal.Footer>
        <SubmitButtonRHF>{intl.form.submit}</SubmitButtonRHF>
      </FormRHFModal.Footer>
    </FormRHFModal>
  );
}
