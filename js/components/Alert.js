function Alert({ type, message, onClose }) {
  try {
    const [visible, setVisible] = React.useState(true);
    
    React.useEffect(() => {
      if (!onClose) {
        // Auto close after 5 seconds if no onClose provided
        const timer = setTimeout(() => {
          setVisible(false);
        }, 5000);
        
        return () => clearTimeout(timer);
      }
    }, [onClose]);
    
    if (!visible) return null;
    
    let bgColor, icon;
    
    switch (type) {
      case 'success':
        bgColor = 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
        icon = 'check-circle';
        break;
      case 'error':
        bgColor = 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
        icon = 'exclamation-circle';
        break;
      case 'warning':
        bgColor = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
        icon = 'exclamation-triangle';
        break;
      case 'info':
      default:
        bgColor = 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
        icon = 'info-circle';
    }
    
    return (
      <div 
        className={`rounded-md p-4 mb-4 flex items-center justify-between ${bgColor}`}
        data-name="alert"
      >
        <div className="flex items-center" data-name="alert-content">
          <i className={`fas fa-${icon} mr-2`} data-name="alert-icon"></i>
          <span data-name="alert-message">{message}</span>
        </div>
        
        <button 
          onClick={() => {
            setVisible(false);
            if (onClose) onClose();
          }}
          className="text-lg font-bold"
          data-name="alert-close"
        >
          &times;
        </button>
      </div>
    );
  } catch (error) {
    console.error('Alert component error:', error);
    reportError(error);
    return null;
  }
}
