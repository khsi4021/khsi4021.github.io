[V, D] = eig(0.5 * (A + A.'));
[~, k] = max(diag(D));
u = V(:, k);
best = Inf; x0 = 1e-3 * u;
for sg = [1, -1]
    [s, ok] = crr.scale_to_target(mu, C2D, hbr, M * (sg * u), target);
    if ok && s < best
        best = s; x0 = sg * s * u;
    end
end
out.warm_dv = x0; out.warm_norm = norm(x0);
% --- fmincon, variables in mm/s for conditioning
sc = 1e3;
obj = @(x) objq(x);
con = @(x) conpc(x, mu, M, C2D, hbr, target, sc);
opts = optimoptions('fmincon', 'Algorithm', 'sqp', 'SpecifyObjectiveGradient', true, 'Display', 'off', ...
    'ConstraintTolerance', 1e-9, 'StepTolerance', 1e-12, 'OptimalityTolerance', 1e-10, 'MaxIterations', 300, ...
    'FiniteDifferenceType', 'central');
[x, ~, flag, outp] = fmincon(obj, x0 * sc, [], [], [], [], [], [], con, opts);
if flag <= 0 || (isfinite(best) && norm(x / sc) > norm(x0))
    x = x0 * sc;  % fmincon must not be worse than the analytic warm start
