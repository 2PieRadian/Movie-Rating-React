import { useEffect } from "react";

export function useKey(key, action) {
  useEffect(
    function () {
      // Common function to run for both Mount and CleanUp function
      function callbackKeyListener(e) {
        if (e.key.toLowerCase() == key.toLowerCase()) {
          action();
        }
      }

      document.addEventListener("keydown", callbackKeyListener);

      return function () {
        document.removeEventListener("keydown", callbackKeyListener);
      };
    },
    [key, action]
  );
}