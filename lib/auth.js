import { useRouter } from "next/router";
import { useEffect } from "react";

const authurize = (Component) => {
  const auth = (props) => {
    const router = useRouter();
    useEffect(() => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        router.push('/login')
      }
      
    }, [router]);
    return <Component {...props} />;
  };

  return auth;
};
export default authurize;