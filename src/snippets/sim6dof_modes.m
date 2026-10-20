function md = sim_modes(sys, V)
% Classify modes of the linearized Simulink model by eigenvector content.
[Vec, D] = eig(sys.A); ev = diag(D);
sn = sys.StateName;
lonI = find(ismember(sn, {'u','w','q','theta'}));
latI = find(ismember(sn, {'v','p','r','phi'}));
sc = ones(numel(sn),1); sc(ismember(sn,{'u','v','w'})) = 1/V;
keep = abs(ev) < 5 & abs(ev) > 1e-4;          % drop actuator / filter / engine poles & neutral modes
lonE = zeros(size(ev)); latE = lonE;
for k = 1:numel(ev)
    x = abs(Vec(:,k)).*sc; lonE(k) = norm(x(lonI)); latE(k) = norm(x(latI));
end
isLon = keep & lonE > latE;
isLat = keep & latE > lonE;
lonc = ev(isLon & imag(ev)>0); [~,i] = sort(abs(lonc),'descend'); lonc = lonc(i);
latc = ev(isLat & imag(ev)>0);
latr = ev(isLat & abs(imag(ev))<1e-9); [~,i] = sort(abs(latr),'descend'); latr = latr(i);
md.short_period = lonc(1); md.phugoid = lonc(end);
md.dutch_roll = latc(1); md.roll = latr(1); md.spiral = latr(end);
end
