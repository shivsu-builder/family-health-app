export default function Panel({ title, icon, children, className = '', bodyClass = '' }) {
  return (
    <div className={`bg-white rounded-xl shadow border border-gray-100 flex flex-col min-h-0 ${className}`}>
      {title && (
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100 shrink-0">
          {icon && <span className="text-base">{icon}</span>}
          <h3 className="font-semibold text-gray-700 text-sm">{title}</h3>
        </div>
      )}
      <div className={`flex-1 overflow-y-auto min-h-0 ${bodyClass || 'p-3'}`}>
        {children}
      </div>
    </div>
  )
}
