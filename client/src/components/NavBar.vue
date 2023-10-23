<template>
    <div>
        



<nav class="navbar  navbar-expand-lg navbar-dark bg-dark ">
    <div class="container">
        
            <router-link to="/" class="navbar-brand">XLS File System</router-link>
      
            
            
              <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
              </button>
              <div class="collapse navbar-collapse" id="navbarSupportedContent">
                
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                  
                  </ul>
           
                  
                    
                  <div class="">
                  
                  <div>
                    <!-- <button routerLink="/newcontact" class="btn btn-outline-secondary">All Files</button> -->
                      <router-link to="/allFiles"  class="link"> All Files</router-link>
                    
                  </div> 
                </div>
          
          
             
            </div>
        </div>
       
        

        

        <!-- <div *ngIf="!isLogin">

                
          <button  (click)="login()" class="btn btn-outline-secondary">login</button>
      </div>
      <div *ngIf="isLogin">
          <button [routerLink]="'/cart'"  class="btn btn-outline-secondary">Cart</button>
          &nbsp;
          <button (click)="logout()"  class="btn btn-outline-secondary">logout</button>
      </div> -->
    
   
  </nav>
    </div>
</template>

<style scoped>
.link{
    text-decoration: none;
    color: White;
    border: 1px solid white;
    padding: 10px;
    border-radius: 10px;
}
</style>