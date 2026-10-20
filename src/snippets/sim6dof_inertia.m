% ---------------- mass properties (stability axes) ---------------------
W   = 636636 * lbf;
ac.mass.m = W / g0;                         % [kg]
Ix  = 18.2e6 * slugft2;
Iy  = 33.1e6 * slugft2;
Iz  = 49.7e6 * slugft2;
Ixz = -1.56e6 * slugft2;   % PRODUCT of inertia, Ixz = integral(x*z dm)
% Inertia TENSOR as the Aerospace Blockset 6DOF block expects it.
% Off-diagonal terms are the NEGATIVE of the products of inertia.
% (Getting this sign wrong makes the Dutch roll go unstable.)
ac.mass.J = [ Ix    0   -Ixz ;
              0     Iy   0   ;
             -Ixz   0    Iz  ];

