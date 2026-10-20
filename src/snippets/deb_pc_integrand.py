def _band_prob(lo: F, hi: F) -> F:
    """P(lo < Z < hi) for standard normal Z, accurate in both tails."""
    upper = lo > 0  # whole band in the upper tail: use symmetry Phi(-lo) - Phi(-hi)
    return np.where(upper, special.ndtr(-lo) - special.ndtr(-hi), special.ndtr(hi) - special.ndtr(lo))


def _integrand(x: F, mx: F, my: F, sx: F, sy: F, R: F) -> F:
    """Minor-axis Gaussian density times major-axis band probability over the chord."""
    h = np.sqrt(np.maximum(R**2 - x**2, 0.0))
    gx = np.exp(-0.5 * ((x - mx) / sx) ** 2) / (np.sqrt(2.0 * np.pi) * sx)
    return gx * _band_prob((-h - my) / sy, (h - my) / sy)

