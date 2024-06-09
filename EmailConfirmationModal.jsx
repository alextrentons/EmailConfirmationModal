import { useState, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { ModalContainer } from '../../UI/ModalContainer/ModalContainer';
import { Checkbox, CheckboxTypes } from '../../UI/Checkbox/Checkbox';
import { Button, buttonTypes } from '../../UI/Button/Button';
import { setAlert } from '../../actions/alert';
import {
  openConfirmationModal,
  sendConfirmationToken,
  checkConfirmationToken,
  openConfirmationMessage
} from '../../actions/confirmation';
import classes from './EmailConfirmationModal.module.css';
import logo from '../../img/logo.png';
import emailIcon from '../../img/email_icon.png';
import { FaExclamationCircle, FaRegPaperPlane } from 'react-icons/fa';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { DataLoader } from '../../UI/Loaders/Loaders';
import { secondaryColor } from '../../utils/constants';

const EmailConfirmationModal = ({
  auth: { user, isAuthenticated },
  confirmation: {
    isOpenModal,
    loading,
    isOpenConfirm,
    emailConfirmed,
    checkLoading
  },
  openConfirmationModal,
  sendConfirmationToken,
  checkConfirmationToken,
  openConfirmationMessage,
  setAlert
}) => {
  const { search } = useLocation();
  const token = useMemo(() => {
    const s = new URLSearchParams(search);
    return s.get('emailConfirmToken');
  }, [search]);
  const [subscribe, setSubscribe] = useState(true);
  const [success, setSuccess] = useState(false);
  const onChange = () => {
    setSubscribe(!subscribe);
  };
  const onClick = async () => {
    const res = await sendConfirmationToken(subscribe);
    if (res) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        openConfirmationModal(false);
      }, 5000);
    } else {
      setAlert('Something went wrong. Please try again later', 'error');
    }
  };

  useEffect(() => {
    if (token && !user.emailConfirmed) {
      openConfirmationMessage(true);
      checkConfirmationToken(token);
    }
  }, [
    openConfirmationMessage,
    checkConfirmationToken,
    token,
    user.emailConfirmed
  ]);

  useEffect(() => {
    if (!checkLoading && token && !user.emailConfirmed) {
      setTimeout(() => {
        openConfirmationMessage(false);
      }, 5000);
    }
  }, [openConfirmationMessage, token, checkLoading, user.emailConfirmed]);

  if (user.emailConfirmed) return null;

  if (isOpenConfirm) {
    return (
      <ModalContainer
        header={
          <div className={classes.confirmMessageBox}>
            {checkLoading ? (
              <DataLoader color={secondaryColor} />
            ) : emailConfirmed ? (
              <>
                <IoMdCheckmarkCircleOutline
                  className={classes.confirmSuccessIcon}
                />
                <div className={classes.confirmSuccessText}>
                  <p>Your email is successfully verified.</p>
                  <p>Thank you for using Vendor Portal!</p>
                </div>
              </>
            ) : (
              <>
                <FaExclamationCircle className={classes.confirmErrorIcon} />
                <div className={classes.confirmErrorText}>
                  <p>Email verification failed.</p>
                  <p>Try again later</p>
                </div>
              </>
            )}
          </div>
        }
        isOpen={isOpenConfirm}
        setIsOpen={openConfirmationMessage}
        modalClass={classes.confirmModal}
        containerClass={classes.confirmModalContainer}
        bodyClass={classes.modalBodySuccess}
        headerClass={
          checkLoading
            ? classes.confirmLoading
            : emailConfirmed
            ? classes.confirmSuccess
            : classes.confirmError
        }
        hideCloseButton
      />
    );
  }

  if (success) {
    return (
      <ModalContainer
        header={
          <div className={classes.modalHeaderSuccess}>
            <FaRegPaperPlane className={classes.successIcon} />
            <span className={classes.modalHeaderSuccessText}>
              We've sent an email to {user.email} in order to verify your email
              address
            </span>
          </div>
        }
        isOpen={isOpenModal}
        setIsOpen={openConfirmationModal}
        containerClass={classes.modalContainerSuccess}
        bodyClass={classes.modalBodySuccess}
        headerClass={classes.modalHeaderContainer}
        hideCloseButton
      />
    );
  }

  if (!isAuthenticated) return null;

  return (
    <ModalContainer
      header={
        <div className={classes.modalHeader}>
          <div className={classes.logoContainer}>
            <img src={logo} alt="Logo" />
          </div>
          <div className={classes.verticalLine} />
          <p className={classes.modalTitle}>Vendor Portal</p>
        </div>
      }
      isOpen={isOpenModal}
      setIsOpen={openConfirmationModal}
      containerClass={classes.modalContainer}
      bodyClass={classes.modalBody}
      headerClass={classes.modalHeaderContainer}
    >
      <div className={classes.emailBox}>
        <img className={classes.emailIcon} src={emailIcon} alt="Email Icon" />
        <span>Verify your email address</span>
      </div>
      <div className={classes.bodyBox}>
        <div className={classes.bodyBoxContent}>
          <b>
            In order to use Vendor Portal account, you need to confirm your
            email address
          </b>
          <div className={classes.horizontalLine}></div>
          <div className={classes.subscription}>
            <Checkbox
              size="22px"
              active={subscribe}
              onChange={onChange}
              checkboxType={CheckboxTypes.MAIN_GREEN}
            />
            <span>Subscribe to WebyCorp Newsletter</span>
          </div>
          <Button
            buttonType={buttonTypes.SECONDARY}
            onClick={onClick}
            disabled={loading}
            loading={loading}
          >
            Verify Email Address
          </Button>
        </div>
      </div>
    </ModalContainer>
  );
};

const mapStateToProps = (state) => ({
  confirmation: state.confirmation,
  auth: state.auth
});
export default connect(mapStateToProps, {
  openConfirmationModal,
  setAlert,
  sendConfirmationToken,
  checkConfirmationToken,
  openConfirmationMessage
})(EmailConfirmationModal);
