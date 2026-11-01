export function targetWordCount(minutes) {
  if (!Number.isInteger(minutes) || minutes < 5 || minutes > 25) {
    throw new RangeError('Podcast duration must be between 5 and 25 minutes.');
  }
  // TTS speaks faster than a conversational script's word-count estimate.
  // The floor prevents five-minute requests from falling below the minimum.
  return Math.max(850, minutes * 160);
}

export function audioDurationIsValid(seconds, minutes) {
  if (!Number.isFinite(seconds) || !Number.isInteger(minutes) || minutes < 5 || minutes > 25) return false;
  const requested = minutes * 60;
  return seconds >= 300 && seconds <= 1500 && Math.abs(seconds - requested) <= requested * 0.3;
}
