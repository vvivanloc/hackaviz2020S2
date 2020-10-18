import os
import json
import pandas
import sys
sys.path

# process per arc
# ---------------
rawArc = pandas.read_csv('data/DGAC_flux.csv')
print(rawArc.head())
arcProject = rawArc[['Annee', 'Origine', 'Destination', 'lat_Origine', 'lng_Origine',
                     'lat_Destination', 'lng_Destination', 'Pax_Total', 'Fret_Total']]  # Pax_reg  Pax_Non_rég
print(arcProject.head())
if not os.path.exists('out'):
    os.makedirs('out')

# put year data in rows indexed by src,dest
arcProjectFilter2009 = arcProject[(arcProject['Annee'] == 2009)]
arcProjectFilter2019 = arcProject[(arcProject['Annee'] == 2019)]

arcProjectFilter2009 = arcProjectFilter2009[['Origine', 'Destination',
                                             'lat_Origine', 'lng_Origine', 'lat_Destination', 'lng_Destination', 'Pax_Total', 'Fret_Total']]
arcProjectFilter2009.set_index(['Origine', 'Destination'])

print(arcProjectFilter2009.head())

arcProjectFilter2019 = arcProjectFilter2019[[
    'Origine', 'Destination', 'Pax_Total', 'Fret_Total']]
arcProjectFilter2019.set_index(['Origine', 'Destination'])

print(arcProjectFilter2019.head())

arcProjectFilterJoin = pandas.merge(arcProjectFilter2009,  arcProjectFilter2019, on=[
                                    'Origine', 'Destination'], how='outer', suffixes=('_2009', '_2019'))

print(arcProjectFilterJoin.head())

# ease interactivity by drawing small items last
arcProjectFilterJoin = arcProjectFilterJoin.sort_values(
    by=['Pax_Total_2019', 'Fret_Total_2019'], ascending=False)

# write as csv, json and js
arcProjectFilterJoin.to_csv('out/arcs.csv')
result = arcProjectFilterJoin.to_json('out/arcs.json', orient="records")
open("out/arcs.js", "w").write("const _arcs=" +
                               open("out/arcs.json").read())

# process per node
# ---------------
rawNode = pandas.read_csv('data/Eurostats_large.csv')
print(rawNode.head())
nodeFilter = rawNode[(rawNode['tra_meas'] == 'PAS_CRD') |
                     (rawNode['tra_meas'] == 'FRM_LD_NLD')]
print(nodeFilter.head())

nodeFilterPerYear = nodeFilter[['tra_meas', 'ville']]
# accumulate for each year
for i in range(2010, 2020):
    accumMonth = 0
    for j in range(1, 13):
        accumMonth = accumMonth+nodeFilter[str(i)+"M"+f"{j:02d}"]
    nodeFilterPerYear["A"+str(i)] = accumMonth

# join with lat-lon
latlon = pandas.read_csv('data/villes.csv')

nodeFilterPerYear = nodeFilterPerYear.set_index(
    'ville').join(latlon.set_index('ville'))
nodeFilterPerYear = nodeFilterPerYear.reset_index()
print(nodeFilterPerYear.head())

nodeFilterPerYearProject = nodeFilterPerYear[[
    'ville', 'tra_meas', 'A2010', 'A2019', 'lat', 'lng']]

# ease interactivity by drawing small items last
nodeFilterPerYearProject = nodeFilterPerYearProject.sort_values(
    by=['A2019'], ascending=False)

# write as csv, json and js
nodeFilterPerYearProject.to_csv('out/nodes.csv')

result = nodeFilterPerYearProject.to_json(
    'out/nodes.json', orient="records")
open("out/nodes.js", "w").write("const _nodes=" +
                                open("out/nodes.json").read())
