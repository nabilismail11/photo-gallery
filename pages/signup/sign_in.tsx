import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";

import Account from "../../components/Account";

const SignUp = () => {
  const session = useSession();
  const supabase = useSupabaseClient();

  return (
    <div className="container w-50" style={{ padding: "50px 0 100px 0" }}>
      {!session ? (
        <Auth
          view="sign_in"
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: "#4338ca",
                  brandAccent: "#4338ca",
                },
              },
            },
          }}
          theme="dark"
        />
      ) : (
        <Account session={session} />
      )}
    </div>
  );
};

export default SignUp;
