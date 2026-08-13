export const formatTanggal = (isoString) => {
  if (!isoString) return "-";
  const date = new Date(isoString);

  const tanggal = date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const jam = date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${tanggal}, ${jam}`;
};