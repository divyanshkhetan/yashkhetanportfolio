import { useRef, useState } from "react";
import { getSession, useSession } from "next-auth/react";
import styles from "./changePassword.module.css";
import axios from "axios";
import { useRouter } from "next/router";

export default function ChangePassword() {
  const oldPassword = useRef("");
  const newPassword = useRef("");
  const confirmPassword = useRef("");

  const router = useRouter();
  const {data: session} = useSession();
  const [errorMsg, setErrorMsg] = useState(null);

  function submitHandler(e) {
    e.preventDefault();
    const oldPasswordValue = oldPassword.current.value;
    const newPasswordValue = newPassword.current.value;
    const confirmPasswordValue = confirmPassword.current.value;
    if (newPasswordValue !== confirmPasswordValue) {
      setErrorMsg("Passwords do not match");
      return;
    }
    
    if(newPasswordValue.length < 8) {
        setErrorMsg("Password must be at least 8 characters");
        return;
    }

    if(session) {
        const email = session.user.email;
        axios
          .post("/api/changePassword", {
            email: email,
            oldPassword: oldPasswordValue,
            newPassword: newPasswordValue,
          })
          .then((res) => {
            if (res.data.success) {
              setErrorMsg(null);
              router.push("/admin/dashboard");
            } else {
              setErrorMsg(res.data);
            }
          })
          .catch((err) => {
            console.log(err);
            setErrorMsg(err.response.data);
          });
    } else {
      setErrorMsg("You must be logged in to change your password");
      return;
    }
  }

  return (
    <>
      <div className={styles.container}>
        <h1>Change Password</h1>
        <form className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="oldPassword">Old Password</label>
            <input
              type="password"
              id="oldPassword"
              ref={oldPassword}
              className={styles.formfield}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              ref={newPassword}
              className={styles.formfield}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="newPasswordConfirm">Confirm Password</label>
            <input
              type="password"
              id="newPasswordConfirm"
              ref={confirmPassword}
              className={styles.formfield}
              required
            />
          </div>
          {errorMsg ? (
            <div className={styles.formGroup}>
              <div className={styles.errorMsg}>*{errorMsg}</div>
            </div>
          ) : null}
          <button className={styles.btn} onClick={(e) => submitHandler(e)}>
            Change Password
          </button>
        </form>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (session) {
    return { props: { session } };
  } else {
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }
}
