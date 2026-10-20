xdot(1) = x(3)*cos(x(4)); % x_dot = v*cosd(theta) [m/s]
xdot(2) = x(3)*sin(x(4)); % y_dot = v*sind(theta) [m/s]
xdot(3) = -(C_D_m*x(3)^2) - g*sin(x(4)); % v_dot = -(C_D*v^2)/m - g*sind(theta) [m/s^2]
xdot(4) = -g*cos(x(4))/x(3); % theta_dot = -g*cosd(theta)/v [rad/s]

