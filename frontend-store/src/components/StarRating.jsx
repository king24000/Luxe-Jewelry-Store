// Tiny decorative star rating (static demo rating derived from product id).
export default function StarRating({ value = 5 }) {
  return (
    <span className="stars" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= value ? 'on' : 'off'}>★</span>
      ))}
    </span>
  )
}
