import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {ActivatedRoute} from '@angular/router';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {Product} from '@shared/interfaces/product.interface';
import {Random} from '@shared/utils/random';
import {snapshotsMap} from '@shared/utils/snapshots-map.operator';
import firebase from 'firebase/app';
import {Observable, of} from 'rxjs';
import {map, startWith, switchMap, tap} from 'rxjs/operators';

@UntilDestroy()
@Component({
  selector: 'jms-w-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private afs: AngularFirestore
  ) { }

  product: Product;
  similar$: Observable<Product[]>;

  ngOnInit() {

    this.product = this.route.snapshot.data.page;

    let random: string;

    this.route.data
      .pipe(
        untilDestroyed(this)
      )
      .subscribe(({page}) => {
        this.product = page;
        this.cdr.markForCheck();
      });

    this.similar$ = this.route.data
      .pipe(
        startWith({}),
        tap(() => random = Random.string(3)),
        switchMap(() => this.similar(random, '>=')),
        switchMap(products => {
          const productSet = this.shuffle(products, [this.product]);

          if (productSet.length < 3) {
            return this.similar(random, '<=')
              .pipe(
                map(prods =>
                  [
                    ...productSet,
                    ...this.shuffle(prods, [...productSet, this.product], 3 - productSet.length)
                  ]
                )
              );
          }

          return of(productSet);
        })
      );
  }

  similar(random: string, direction: '>=' | '<=') {
    return this.afs.collection('products', ref =>
      ref
        .where(firebase.firestore.FieldPath.documentId(), direction, random)
        .limit(5)
    )
      .get()
      .pipe(
        snapshotsMap<Product>()
      );
  }

  shuffle(array: Product[], duplicates: Product[], slice = 3) {

    array = array
      .filter(it =>
        !duplicates.some(prod => prod.id === it.id)
      );

    let currentIndex = array.length;
    let randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array.slice(0, slice);
  }
}
