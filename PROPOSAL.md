# Project Proposal

## Project Objectives

Make a tool that makes it easier for Canadians to visualize and understand datasets provided by the government. These datasets can include millions of records, and thus for an average person are infeasible to parse in a reasonable amount of time, let alone analyze and understand.
For example, an API exists for “contracts over 10,000$” which lists all the contracts the
government has tendered, it includes a text description of the category, the cost, and the
amendment value of the contract. This information is of public interest, but it consists of over a
million records, with few ways to reasonably understand such a large dataset. Our project would
then query and parse this huge dataset into useful metrics and visualize it to show useful
information like clustering by sector or contractor to provide insights to users.

## Potential Challenges

Some potential challenges we expect to encounter:

 1. Open Canada API Query Limits
  We haven’t fully tested the rate limits of the APIs we plan to use, it’s possible that,
even in normal use, the number of records causes us to exceed the APIs query limits.
In that case, we would likely have to work on a caching solution to avoid querying the
same data more than once in order to keep the site online.

 2. Client Fetching Speed
  Large request on the client can freeze the application. We'll need to find a way to minimize requests and potentially cache the data.

 3. Modelling the data in an intuitive way
  While making graphs and visualizations for data may be straightforward, choosing the best types of graphs to present the data may be a challenge.

## Technology Stack

For the frontend we’ll be using Javascript/Typescript, React, and a data visualization library like D3JS. We chose the library D3JS because of the wide range of interactive data visualization templates they provide.
In the event we run into issues with the Open Canada API query limits or have issues with client fetching speeds, we’ll need to implement our own backend for the application. This custom backend allows us to add a caching layer for the data. We’ll use Python and a web framework like Flask. Initially, we’ll implement the database layer in SQLite, with plans to upgrade to a more powerful SQL database server should we run into any performance issues.
