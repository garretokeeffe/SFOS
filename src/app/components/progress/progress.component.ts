import { Component, OnInit } from '@angular/core';
import * as jQuery from 'jquery';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css']
})
export class ProgressComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    /**/

    jQuery( document ).ready(function() {

      var back = jQuery(".prev");
      var	next = jQuery(".next");
      var	steps = jQuery(".step");

      next.bind("click", function() {
        jQuery.each( steps, function( i ) {
          if (!jQuery(steps[i]).hasClass('current') && !jQuery(steps[i]).hasClass('done')) {
            jQuery(steps[i]).addClass('current');
            jQuery(steps[i - 1]).removeClass('current').addClass('done');
            return false;
          }
        });
      });
      back.bind("click", function() {
        jQuery.each( steps, function( i ) {
          if (jQuery(steps[i]).hasClass('done') && jQuery(steps[i + 1]).hasClass('current')) {
            jQuery(steps[i + 1]).removeClass('current');
            jQuery(steps[i]).removeClass('done').addClass('current');
            return false;
          }
        })
      });

    })
  }

}
