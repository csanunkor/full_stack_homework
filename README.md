# Machina Labs Full Stack Homework

[Fork the repo](https://github.com/Machina-Labs/full_stack_homework/fork) to get started.

### Problem Statement

At Machina, we're building software to accelerate robotic manufacturing workflows. Our customers come to us with CAD files for their parts and we do research and development (R&D) to make them manufacturable with our robotic cells ([video demo](https://www.youtube.com/watch?v=uUsloEJkYdw)).

To get to a production-quality part, we have to perform possibly many trials until we succeed in getting getting under some allowable error tolerances. Additionally, this may involve revisions of the customer's original CAD file to make the geometry manufacturable. For the purposes of this homework, a successful trial looks like:

- Prepare some csv files for forming the part
- Form the part with our robotic cells
- Scan the part with our robotic cells
- Analyze the scan data to confirm success or failure

If the trial fails at any point (high tolerance error, metal sheet tears, etc.), we start a new trial by picking up at some earlier step where we think we can make changes to avoid that failure.

### Users and Data Model

Our users are our Machina teammates who are doing the R&D for customers. We store records of the information described above to help make their day-to-day work quicker and easier. Here's an overview of the data model we've supplied in `init.sql` to reflect this:

![./data-model.png](./data-model.png)

# Getting Started

### Installation

- [Clone the repo](https://github.com/csanunkor/full_stack_homework.git) to get started.
- [Install](https://docs.docker.com/desktop/) and run Docker

### Running the Application

In a Non Windows Subsystem for Linux (WSL) environment, you can start the application by running the following comand. The first time it runs, it will run `init.sql` to create tables and populate them with some seed data.

First time running the application use the command:
```
docker-compose up --build
```

If you've ran the app before use the following comand:
```
docker compose up
```
