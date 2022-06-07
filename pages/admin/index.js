import styles from "./index.module.css";
import { getSession, useSession, signIn, signOut } from "next-auth/react"

export default function Index() {
    const {data: session } = useSession();
    if(session) {
        return (
            <>
                <div>signed in as {session.user.name}</div>
                <button onClick={signOut}>Sign out</button>
            </>
        )
    }
    
    return (
        <div className={styles.container}>
            <h1>Admin</h1>
            <button onClick={() => signIn(undefined, { callbackUrl: "/admin/dashboard" })}>Sign in</button>
        </div>
    )
}

export async function getServerSideProps(context) {
    const session = await getSession(context);
    if (session) {
      return {
        redirect: {
          destination: "/admin/dashboard",
          permanent: false,
        },
      };
    }
  
    return {
      props: { session },
    };
  }