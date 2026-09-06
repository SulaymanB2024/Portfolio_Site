#!/usr/bin/env python3
"""Reproduce the central denominator estimates in the independent-app income report.
Plausible intervals are model uncertainty intervals, not frequentist confidence intervals.
"""
import numpy as np
SEED=20260714; N=500_000
rng=np.random.default_rng(SEED)
tri=lambda a,m,b: rng.triangular(a,m,b,N)
q=lambda x: np.quantile(x,[.025,.5,.975])*100
p_hit=tri(.13,.173,.22); p_current=tri(.35,.75,.95); transfer=tri(.45,.85,1.35)
p3=np.minimum(p_hit*p_current*transfer,.95)
p4=np.minimum(p3*tri(1,1.16,1.45),.95)
p0=tri(0,.0002,.002); p1=tri(.0005,.005,.025); p2=tri(.01,.035,.10)
ps=np.vstack([p0,p1,p2,p3,p4]).T
mix={
 'A. All listed apps':[70,18,7,4,1],
 'B. Active apps':[.1,62,23,11,3.9],
 'C. Active monetized apps':[.05,.05,52,34,13.9],
 'D. Independently owned active apps':[.05,45,30,19,5.95]}
apps={}
for name,weights in mix.items():
    weights=np.asarray(weights,float); w=rng.dirichlet(weights/weights.sum()*20,size=N)
    apps[name]=(w*ps).sum(1)
apps['E. Serious commercial attempts']=p3; apps['F. Maintained for at least 12 months']=p4
ns=np.array([1,2,3,4,5,8]); ws=np.array([.58,.22,.10,.05,.03,.02])
d=tri(.40,.65,.95)
bonus={'A. All listed apps':(0,.0002,.001),'B. Active apps':(0,.0008,.004),'C. Active monetized apps':(0,.002,.009),'D. Independently owned active apps':(0,.0015,.007),'E. Serious commercial attempts':(0,.004,.014),'F. Maintained for at least 12 months':(0,.0045,.016)}
for name,p in apps.items():
    anyhit=sum(w*(1-(1-p)**n) for n,w in zip(ns,ws))
    dev=np.minimum(p+d*(anyhit-p)+tri(*bonus[name]),.99)
    print(name, 'app', np.round(q(p),2), 'developer', np.round(q(dev),2))
