export enum DateFormat {
  Standard = 'standard',
}

export const formatStringToDate = (
  dateString: string,
  format = DateFormat.Standard,
): Date => {
  let startDate: Date;
  if (format === DateFormat.Standard) {
    startDate = new Date(dateString);
    startDate.setSeconds(0, 0);
    startDate.toISOString();
  }
  return startDate;
};

export const removeNonNumberChars = (string: string | number)=>  {
  return string.toString().replace(/[^0-9.-]/g, '');
}
