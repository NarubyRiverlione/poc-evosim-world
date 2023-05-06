# Evo Sim - Start World

| Statements                  | Branches                | Functions                 | Lines                |
| --------------------------- | ----------------------- | ------------------------- | -------------------- |
| ![Statements](https://img.shields.io/badge/Coverage-99.54%25-brightgreen.svg) | ![Branches](https://img.shields.io/badge/Coverage-99.63%25-brightgreen.svg) | ![Functions](https://img.shields.io/badge/Coverage-99.28%25-brightgreen.svg) | ![Lines](https://img.shields.io/badge/Coverage-99.52%25-brightgreen.svg)    |


# World  

## 1) WorldObject Thick
### 1.1 Animal Thick --> add age, add thirst, remove energy
####  1.1.A) NewLocation 
        --> set WoldObject coord to new location via current direction
        --> new random direction if wandering and wandering steps are done.
####  1.1.B) DirectionToTarget
        --> current wandering = no need for direction to target, skip 
        --> no Target = start wandering, skip 
  ##### Movement DirectionToGoal
          --> start Wandering if on previous location (workaround)
          --> set directions to Target 
    
### 1.2 super Thick 
        --> no energy => exist = false


## 2) (no longer) exist --> remove for World


## 3)  WorldObject is moveable ? 
### 3.1) check World boundaries, correct movement if needed
### 3.2) collision detection:
        --> will move into Place occupied with (still existing) WorldObject ?
### 3.3) execute move in Wold :
        --> remove form previous Place, add into new Place
### 3.4) find target
        --> default food but water is thirst is above threshold
### 3.5) create offspring is energy is above threshold
  