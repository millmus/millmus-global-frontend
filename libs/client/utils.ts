export const cls = (...classnames: string[]) => {
  return classnames.join(' ');
};

export const trimDate = (date: string, start: number, end: number) =>
  date.split('T')[0].slice(start, end);

export const fbqProductTrack = (event: string, data: any, totalPrice: any) => {
  // @ts-ignore
  window.fbq('track', event, {
    content_ids: data?.id,
    content_name: data?.name,
    content_category: data?.category,
    content_type: "product",
    currency: "KRW", 
    value: totalPrice??data?.price
  });
}