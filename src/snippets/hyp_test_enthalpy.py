def total_enthalpy_residual(sol) -> float:
    """max ``|(C S')' + f S'|`` with ``S = H/H_e``; must vanish at ``Pr = 1``.

    Evaluated with ``C = 1`` (linear viscosity), so the identity reduces to
    ``S'' + f S' = 0``.  Sampled on the interior to avoid end effects.
    """
    r = 0.5 * (sol.gamma - 1.0) * sol.M_e**2
    S = (sol.g + r * sol.fp**2) / (1.0 + r)
    eta = sol.eta
    dS = np.gradient(S, eta, edge_order=2)
    d2S = np.gradient(dS, eta, edge_order=2)
    interior = (eta > 0.3) & (eta < eta[-1] * 0.6)
    return float(np.max(np.abs((d2S + sol.f * dS)[interior])))


@pytest.mark.parametrize("beta, M_e", [(0.5, 2.0), (1.0, 2.0), (1.757, 1.05)])
def test_printed_energy_equation_violates_total_enthalpy_when_beta_mach_nonzero(
        beta, M_e):
    """Guards the diagnosis itself: at Pr = 1 total enthalpy must obey
    ``(C S')' + f S' = 0`` for any beta.  (C 4) as printed does not."""
    sol = solve_similarity(beta=beta, M_e=M_e, T_e=400.0, T_w=300.0, Pr=1.0,
                           viscosity_law="linear", energy_form=ENERGY_PAPER)
    assert total_enthalpy_residual(sol) > 1e-2


@pytest.mark.parametrize("beta, M_e",
                         [(0.0, 2.0), (0.5, 2.0), (1.0, 2.0), (1.0, 0.66),
                          (1.757, 1.05)])
def test_pressure_work_form_conserves_total_enthalpy_at_pr_one(beta, M_e):
    """The restored term makes the identity hold for *every* beta -- this is
    what verifies the derived term, independently of any external source."""
    sol = solve_similarity(beta=beta, M_e=M_e, T_e=400.0, T_w=300.0, Pr=1.0,
                           viscosity_law="linear",
                           energy_form=ENERGY_PRESSURE_WORK)
    assert total_enthalpy_residual(sol) < 1e-4
