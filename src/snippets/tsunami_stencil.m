[h, hx, hy] = depth2D(x,y);
constLeft  = lamb*( h - deltaX*hx/2 );
constRight = lamb*( h + deltaX*hx/2 );
constBot   = lamb*( h - deltaY*hy/2 );
constTop   = lamb*( h + deltaY*hy/2 );
constCent  = constTop + constBot + constRight + constLeft;

% interior update, inside the space loops (i = row/y, j = column/x):
uFut(i,j) = ((constLeft(i,j) * uCur(i,j-1)) + ((2 - constCent(i,j)) * uCur(i,j)) + (constRight(i,j) * phantomRight) + (constTop(i,j) * phantomTop) + (constBot(i,j) * phantomBot)) - uInit(i,j);
