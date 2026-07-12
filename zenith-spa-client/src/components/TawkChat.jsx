import { useEffect } from "react";

const TAWK_PROPERTY_ID = "6a53687d2fb9e11d44f3e20e";
const TAWK_WIDGET_ID = "1jtat0av2";

const TawkChat = () => {
  useEffect(() => {
    // Avoid injecting the script twice (e.g. React StrictMode double-invoke, or hot reload in dev)
    if (window.Tawk_API || document.getElementById("tawk-to-script")) return;

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    const script = document.createElement("script");
    script.id = "tawk-to-script";
    script.type = "text/javascript";
    script.async = true;
    script.src = `https://embed.tawk.to/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}`;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");

    document.body.appendChild(script);
  }, []);

  return null;
};

export default TawkChat;