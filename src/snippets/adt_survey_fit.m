    case "endurance"
        % Fit B: size each aircraft's battery from what it flies.
        % Cruise power is drag x speed, P = (W/(L/D))*V, so the energy for a flight
        % of length t is E = W*V*t/((L/D)*eta). L/D and powertrain efficiency eta
        % are not published, so they are lumped into one constant k, set so that the
        % formula returns the Penguin BE's 640 Wh at its own weight, speed and
        % endurance. Every survey aircraft is therefore assumed as efficient as
        % the Penguin.
        k    = E_anchor/(W_anchor*V_anchor*t_anchor);   % = 0.898 Wh per (kg * m/s * h)
        t_h  = leadingNumber(D.endurance_hr);   % published endurance [h]; for a range like "6-10" the low end
        V_ms = leadingNumber(D.cruise_mps);     % published cruise speed [m/s]
        V_ms(isnan(V_ms)) = V_default;          % no published speed -> 18 m/s
        if any(isnan(t_h))
            error('SURVEY:NoEndurance','Endurance missing for: %s', strjoin(D.name(isnan(t_h)),', '));
        end
        % Pack energy density: the first endurance class whose limit is >= the
        % aircraft's endurance. Long-endurance electric UAVs need denser cells.
        e_Whkg = zeros(size(t_h));
        for i = 1:numel(t_h)
            e_Whkg(i) = e_classes(find(t_h(i) <= e_classes(:,1),1),2);
        end
        W_mis = D.MTOW_kg - D.payload_max_kg/2; % typical mission weight [kg]: MTOW less half the max payload
        E_Wh  = k*W_mis.*V_ms.*t_h;             % battery energy needed [Wh], E = k*W*V*t
        BMF   = (E_Wh./e_Whkg)./D.MTOW_kg;      % battery mass [kg] = E/e, divided by MTOW = battery share of W0
% ...
% it into a straight line, log(We/W0) = log(a) + c1*log(W0), solved by
% ordinary least squares.
X  = [ones(numel(W0_lb),1) log(W0_lb)];  % one row per aircraft: [1, log(W0)]
y  = log(We_W0);                         % log of the empty-weight fraction
b  = X\y;                                % least-squares solution: b(1) = log(a), b(2) = c1
