def pant_rt(result, k: float) -> TransitionResult:
    """PANT-RT, Reshotko & Tumin (2004), (A 3)/(A 4).  Project default.

    Transition where ``Re_theta (k/theta) (T_e/T_w)^1.27 >= 180 * 2^1.27``.
    """
    if k <= 0.0:
        raise ValueError("roughness height k must be positive")
    threshold = PANT_RT_THRESHOLD
    theta = result.theta_momentum
    parameter = np.full_like(theta, np.nan)
    good = theta > 0.0
    parameter[good] = (
        result.Re_theta[good] * (k / theta[good])
        * (result.edge.T_e[good] / result.T_w) ** 1.27
    )
    i, s_tr, th_tr = _first_crossing(parameter, threshold, result.s, result.Theta)
    return TransitionResult(
        k=float(k), name="PANT-RT", parameter=parameter, threshold=threshold,
        s=result.s, Theta=result.Theta, tripped=i is not None,
        onset_index=i, s_onset=s_tr, Theta_onset=th_tr,
    )
