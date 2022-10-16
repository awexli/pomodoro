export const getRenderedTime = (time: number) => {
  return time < 10 ? '0' + time : `${time}`;
};
