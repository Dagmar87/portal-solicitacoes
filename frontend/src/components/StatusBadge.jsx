const STATUS_LABELS = {
  ABERTO: 'Aberto',
  EM_ATENDIMENTO: 'Em atendimento',
  CONCLUIDO: 'Concluído',
};

const STATUS_CLASSES = {
  ABERTO: 'status-aberto',
  EM_ATENDIMENTO: 'status-em-atendimento',
  CONCLUIDO: 'status-concluido',
};

export default function StatusBadge({ status }) {
  const label = STATUS_LABELS[status] || status;

  const statusClass = STATUS_CLASSES[status] || '';

  return (
    <span className={`status-badge ${statusClass}`}>
      {label}
    </span>
  );
}