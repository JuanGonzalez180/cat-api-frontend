import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { BreedSelectorComponent } from './breed-selector.component';
import { Breed } from '../../../core/models/breed.model';

describe('BreedSelectorComponent', () => {
  let component: BreedSelectorComponent;
  let fixture: ComponentFixture<BreedSelectorComponent>;

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
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreedSelectorComponent, FormsModule, SelectModule],
    }).compileComponents();

    fixture = TestBed.createComponent(BreedSelectorComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept breeds as input', () => {
    component.breeds = mockBreeds;
    expect(component.breeds.length).toBe(1);
    expect(component.breeds[0].name).toBe('Persian');
  });

  it('should accept selected breed as input', () => {
    component.selectedBreed = mockBreeds[0];
    expect(component.selectedBreed).toEqual(mockBreeds[0]);
  });

  it('should emit breedSelected event when onBreedSelect called', () => {
    spyOn(component.breedSelected, 'emit');
    component.onBreedSelect(mockBreeds[0]);
    expect(component.breedSelected.emit).toHaveBeenCalledWith(mockBreeds[0]);
  });

  it('should have empty breeds array by default', () => {
    const newComponent = new BreedSelectorComponent();
    expect(newComponent.breeds).toEqual([]);
  });

  it('should have null selected breed by default', () => {
    const newComponent = new BreedSelectorComponent();
    expect(newComponent.selectedBreed).toBeNull();
  });
});
