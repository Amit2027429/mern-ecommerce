const Rating = ({ value, text }) => {
  return (
    <div className="flex items-center gap-2 text-yellow-500">
      {[1, 2, 3, 4, 5].map((index) => (
        <span key={index} className={value >= index ? 'text-yellow-400' : 'text-slate-300'}>
          ★
        </span>
      ))}
      {text && <span className="text-sm text-slate-600">{text}</span>}
    </div>
  );
};

export default Rating;
