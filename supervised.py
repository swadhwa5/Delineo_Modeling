import pandas as pd
import json
import googlemaps
gmaps = googlemaps.Client(key='AIzaSyA9rJRoQEsrB75jahB_GjC6y8ejo4AH2_k')

#PROCEDURE TO LABEL DATA
#make new column 'type_of'
#merge columns latitude and longitude in column location
#for each value in location, reverse geocode(location)
#if(type == 'x')
#type_of = 'x'

df = pd.read_csv("./Barnsdall_2020_03_02_full.csv")
#print(df.head)
df["type_of"] = ''
df["location"] = list(zip(df.Latitude, df.Longitude))
locations = df["location"]
for x in locations:
    reverse_geocode_result = gmaps.reverse_geocode(x)
    type = reverse_geocode_result[0]["types"][0]
    #print(type)
    df[x]["type_of"] = type


#code for reverse geocode
#gmaps = googlemaps.Client(key='AIzaSyA9rJRoQEsrB75jahB_GjC6y8ejo4AH2_k')
reverse_geocode_result = gmaps.reverse_geocode((40.714224, -73.961452))
type = reverse_geocode_result[0]["types"][0]  #can change index based on what level of type you want
print(reverse_geocode_result[0]["types"][0])