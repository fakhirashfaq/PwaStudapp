import { Component, OnInit } from '@angular/core';
import { FilterService } from 'src/app/services/filter.service';
import { Constants } from '../utils/constants';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit  {
  changeText:any[] = []
    categories: { category: string; subCategory: { name: string; }[]; }[];
    constructor(private filterService: FilterService){}
    ngOnInit() {
        this.categories = Constants.categories;
    }


    public navigateToCtg(selectedCtg: string): void {
      this.filterService.navigateWithCategory(selectedCtg);
    }
    public navigateToMainCtg(selectedMainCategory:string):void {
      if(selectedMainCategory == 'All'){
        this.filterService.navigateWithCategory('All')
      }else {
        return
      }
      
    }
}