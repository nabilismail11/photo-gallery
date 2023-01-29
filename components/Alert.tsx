import { useState, useEffect } from "react";

export default function Alert({ msg, type }: { msg: string; type: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (msg) {
      setShow(true);
      setInterval(() => {
        setShow(false);
      }, 2000);
    }
  }, [msg]);
  return <>{show && <div className={`alert alert-${type}`}>{msg}</div>}</>;
}
