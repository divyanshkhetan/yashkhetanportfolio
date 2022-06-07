import { getSession, signOut } from "next-auth/react";
import styles from "./dashboard.module.css";
import Link from "next/link";

export default function dashboard() {
    return (
      <>
        <div className={styles.navbar}>
            <div className={styles.navbar__item}>
                <h1 className={styles.dashboardBanner}><a href="/admin/dashboard">Dashboard</a></h1>
                <div className={styles.btnSection}>
                  <button className={styles.btn}>Create Project</button>
                  <Link href="/admin/changePassword"><button className={styles.btn}>Change Password</button></Link>
                  <button className={styles.signOutBtn} onClick={() => signOut()}>Sign out</button>
                </div>
            </div>
        </div>
        <div className={styles.container}>
          <p>
              This is the dashboard page. You can use this page to display some
              information about your application.
          </p>
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