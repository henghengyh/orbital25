File: `package.json` 
===
Created on 2025-05-01, using CLI cmd: `npm init -y` in directory `orbital25/server`

# Initialisation
This file contains metadata about the project, including its name, version, description, main entry point, scripts, and dependencies.
- It is used by npm to manage the project's dependencies and scripts.
- The file is structured in JSON format and includes various fields such as `"name"`, `"version"`, `"description"`, `"main"`, `"scripts"`, `"dependencies"`, and `"devDependencies"`.
- The `"private"` field is set to true to prevent accidental publication to the npm registry.

# Explanation
The `package.json` file is like a recipe book for a software project. It tells the computer what the project is about, what tools it needs to run, and how to perform certain tasks. Here's what each part means:

1. Project Information:
    - `"name"`: The name of the project (e.g. `"travelgo-server"`).
    - `"version"`: The version of the project (e.g. `"1.0.0"`). This helps track updates.
    - `"description"`: A short explanation of what the project does.
2. Main File:
    - `"main"`: The starting point (_entry point like PSVM of java files_) of the project (e.g., `"server.js"`). This is the file that runs first.
3. Scripts:
    - `"scripts"`: These are like shortcuts for common tasks. For example:
        - `"start"`: Runs the project.
        - `"dev"`: Runs the project in development mode (automatically restarts when changes are made).
4. Dependencies:
    - `"dependencies"`: These are the tools and libraries the project needs to work. For example:
    - `express`: Helps the project handle website requests.
    - `mongoose`: Helps the project talk to a database.
    - `"devDependencies"`: These are tools needed only while building or testing the project, not when it's running.
        - e.g. The `^2.4.3` in your package.json file is a version range specifier for the dependency `bcryptjs`.
5. Other Settings:
    - `"private"`: Prevents the project from being accidentally shared publicly.
    - `"engines"`: Specifies the version of Node.js required to run the project.
