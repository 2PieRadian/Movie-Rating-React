import { useState } from 'react';
import StarRating from './StarRating';

export default function Test() {
  const [rating, setRating] = useState(0);

  function handleSetRating(rating) {
    setRating(rating)
  }

  return (
    <div>
      <StarRating setOutsideRating={handleSetRating} />
      <p>This movie was rated {rating} stars.</p>
    </div>
  );
}
