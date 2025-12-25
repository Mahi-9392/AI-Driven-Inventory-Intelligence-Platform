const InsightCard = ({ title, value, subtitle, color = 'blue', icon }) => {
  const colorConfig = {
    blue: {
      bg: 'from-indigo-50 to-white',
      border: 'border-indigo-100',
      text: 'text-indigo-600',
      iconBg: 'bg-indigo-100',
    },
    red: {
      bg: 'from-red-50 to-white',
      border: 'border-red-100',
      text: 'text-red-600',
      iconBg: 'bg-red-100',
    },
    yellow: {
      bg: 'from-amber-50 to-white',
      border: 'border-amber-100',
      text: 'text-amber-600',
      iconBg: 'bg-amber-100',
    },
    green: {
      bg: 'from-emerald-50 to-white',
      border: 'border-emerald-100',
      text: 'text-emerald-600',
      iconBg: 'bg-emerald-100',
    },
  };

  const config = colorConfig[color] || colorConfig.blue;

  return (
    <div className={`card bg-gradient-to-br ${config.bg} border ${config.border} card-hover`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            {icon && (
              <div className={`w-8 h-8 rounded-lg ${config.iconBg} flex items-center justify-center`}>
                {icon}
              </div>
            )}
            <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">{title}</p>
          </div>
          <p className={`text-3xl font-bold ${config.text} mb-1`}>
            {value}
          </p>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default InsightCard;

