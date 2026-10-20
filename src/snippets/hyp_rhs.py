def _make_rhs(beta, g_wall, Pr, gamma, M_e, T_e, mu_e, law,
              energy_form=ENERGY_PAPER):
    """Five-state RHS for (C 3)-(C 4) in conservative variables.

    State vector: ``[f, f', C f'', g, C g']``.

    ``energy_form`` selects between (C 4) exactly as printed and the same
    equation with its pressure-gradient work term restored -- see
    :data:`ENERGY_PAPER` / :data:`ENERGY_PRESSURE_WORK`.
    """
    dissipation = Pr * (gamma - 1.0) * M_e**2
    # Coefficient of the pressure-work term; zero whenever beta or M_e is zero,
    # which is why (C 4) as printed is exact everywhere its sources apply it.
    pressure_work = (dissipation * beta
                     if energy_form == ENERGY_PRESSURE_WORK else 0.0)

    def rhs(eta, y):
        f, fp, Cfpp, g, Cgp = y
        gc = np.maximum(g, _G_FLOOR)
        C = _chapman_rubesin(gc, T_e, mu_e, law)

        fpp = Cfpp / C
        gp = Cgp / C

        # (C 3):  (C f'')' = beta (f'^2 - g) - f f''
        dCfpp = beta * (fp**2 - gc) - f * fpp
        # (C 4):  (C g')' = -Pr f g' - Pr C (gamma-1) M_e^2 f''^2
        dCgp = -Pr * f * gp - dissipation * C * fpp**2
        if pressure_work:
            # - Pr beta (gamma-1) M_e^2 f' (f'^2 - g)
            dCgp = dCgp - pressure_work * fp * (fp**2 - gc)

        return np.vstack([fp, fpp, dCfpp, gp, dCgp])

    def bc(ya, yb):
        return np.array([ya[0], ya[1], ya[3] - g_wall, yb[1] - 1.0, yb[3] - 1.0])

    return rhs, bc
