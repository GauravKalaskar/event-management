const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', danger = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onCancel}>
      <div className="absolute inset-0 bg-surface-900/60 backdrop-blur-sm" />
      <div className="relative bg-white dark:bg-surface-900 rounded-2xl shadow-2xl shadow-surface-900/20 max-w-md w-full p-7 animate-fade-in-up border border-surface-200 dark:border-surface-800" onClick={(e) => e.stopPropagation()}>
        <div className={`w-12 h-12 ${danger ? 'bg-red-100 dark:bg-red-950/50' : 'bg-primary-100 dark:bg-primary-950/50'} rounded-2xl flex items-center justify-center mb-5`}>
          <span className="text-xl">{danger ? '⚠️' : '❓'}</span>
        </div>
        <h3 className="text-xl font-extrabold text-surface-900 dark:text-white mb-2">{title}</h3>
        <p className="text-surface-500 dark:text-surface-400 mb-7 leading-relaxed">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-6 py-2.5 text-sm font-bold text-surface-600 dark:text-surface-300 bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 rounded-xl transition-all">
            Cancel
          </button>
          <button onClick={onConfirm}
            className={`px-6 py-2.5 text-sm font-bold text-white rounded-xl transition-all shadow-md hover:shadow-lg ${
              danger ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-red-500/20' : 'btn-primary'
            }`}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
