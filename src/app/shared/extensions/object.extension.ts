export function toFormData(object: any): FormData {
  const formData = new FormData();

  Object.keys(object).forEach(
    key => {
      if (object[key] !== null) {
        formData.append(key, object[key]);
      }
    }
  );

  return formData;
}
