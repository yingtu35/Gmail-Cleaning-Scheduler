import { useState, useEffect } from "react";

export default function useLoadingButton(action: () => Promise<void>){
  const [loading, setLoading] = useState(false);

  function handleButtonClick() {
    setLoading(true);
  }

  useEffect(() => {
    if (loading) {
      action();
    }
  }, [loading]);

  return {
    loading,
    disabled: loading,
    handleButtonClick
  }
}