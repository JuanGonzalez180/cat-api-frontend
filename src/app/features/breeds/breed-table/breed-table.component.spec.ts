import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { BreedTableComponent } from './breed-table.component';
import { Breed } from '../../../core/models/breed.model';

describe('BreedTableComponent', () => {
  let component: BreedTableComponent;
  let fixture: ComponentFixture<BreedTableComponent>;

  const mockBreeds: Breed[] = [
    {
      id: '1',
      name: 'Persian',
      temperament: 'Affectionate',
      origin: 'Iran',
      description: 'Test',
      life_span: '10-17',
      adaptability: 3,
      affection_level: 5,
      child_friendly: 4,
      dog_friendly: 3,
      energy_level: 2,
      grooming: 5,
      health_issues: 4,
      intelligence: 3,
      shedding_level: 5,
      social_needs: 4,
      stranger_friendly: 3,
      vocalisation: 3,
    },
    {
      id: '2',
      name: 'Siamese',
      temperament: 'Intelligent',
      origin: 'Thailand',
      description: 'Test',
      life_span: '8-15',
      adaptability: 5,
      affection_level: 5,
      child_friendly: 4,
      dog_friendly: 4,
      energy_level: 5,
      grooming: 2,
      health_issues: 3,
      intelligence: 5,
      shedding_level: 2,
      social_needs: 5,
      stranger_friendly: 5,
      vocalisation: 5,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreedTableComponent, FormsModule, TableModule, ButtonModule, InputTextModule, IconFieldModule, InputIconModule],
    }).compileComponents();

    fixture = TestBed.createComponent(BreedTableComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept breeds as input', () => {
    component.breeds = mockBreeds;
    expect(component.breeds.length).toBe(2);
  });

  it('should accept searchQuery as input', () => {
    component.searchQuery = 'Persian';
    expect(component.searchQuery).toBe('Persian');
  });

  it('should emit search event when onSearch called', () => {
    spyOn(component.search, 'emit');
    component.searchQuery = 'test';
    component.onSearch();
    expect(component.search.emit).toHaveBeenCalledWith('test');
  });

  it('should update searchQuery when onSearchQueryChange called', () => {
    component.onSearchQueryChange('Persian');
    expect(component.searchQuery).toBe('Persian');
  });

  it('should have empty breeds array by default', () => {
    const newComponent = new BreedTableComponent();
    expect(newComponent.breeds).toEqual([]);
  });

  it('should have empty searchQuery by default', () => {
    const newComponent = new BreedTableComponent();
    expect(newComponent.searchQuery).toBe('');
  });

  it('should display all breeds in table', () => {
    component.breeds = mockBreeds;
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('tr');
    // 1 header row + 2 data rows
    expect(rows.length).toBeGreaterThanOrEqual(2);
  });
});
