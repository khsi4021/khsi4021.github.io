def test_agreement_would_fail_against_the_axisymmetric_coefficient(result, body, fs):
    """Guards the decision: 0.76 would introduce a systematic ~33% bias."""
    edge = result.edge
    dueds = stagnation_velocity_gradient(edge, body)
    q_axi = fay_riddell_from_edge(edge, T_w=T_WALL, dueds=dueds, Pr=fs.Pr,
                                  planar=False)
    assert abs(result.q_stag / q_axi - 1.0) > 0.20
