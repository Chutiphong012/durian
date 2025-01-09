import { useRouter } from "next/router";
import { useEffect } from "react";

const redirect_login = (Component) => {
  const auth = (props) => {
    const router = useRouter();
    useEffect(() => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        router.push('/')
      }
      
    }, [router]);
    return <Component {...props} />;
  };

  return auth;
};
export default redirect_login;